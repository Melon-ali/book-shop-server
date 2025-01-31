import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { BookModel } from '../book/book.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import { generateOrderId } from '../../utils/generateID';
import { UserModel } from '../user/user.model';
import { orderUtils } from './order.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createOrderIntoDB = async (order: TOrder, client_ip: string) => {
  const bookExists = await BookModel.isBookExists(
    order.product as unknown as string,
  );

  if (!bookExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  const remainingQuantity = bookExists.quantity - order.quantity;

  if (remainingQuantity < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient stock. The order cannot be placed.',
    );
  }

  try {
    // generate order id
    order.orderId = await generateOrderId();

    const newOrder = await OrderModel.create(order);

    if (!newOrder) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    const user = await UserModel.findById(newOrder.user);

    const shurjopayPayload = {
      amount: order.totalPrice,
      order_id: order.orderId,
      currency: 'BDT',
      customer_name: user?.name,
      customer_address: order.address,
      customer_email: user?.email,
      customer_phone: 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await orderUtils.makePayment(shurjopayPayload);

    let updatedOrder: TOrder | null = null;

    if (payment?.transactionStatus) {
      updatedOrder = await OrderModel.findOneAndUpdate(
        { orderId: order.orderId },
        {
          $set: {
            transaction: {
              paymentId: payment.sp_order_id,
              transactionStatus: payment.transactionStatus,
            },
          },
        },
        { new: true },
      );
    }

    if (!updatedOrder) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update order');
    }

    return {
      order: updatedOrder,
      payment,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err);
  }
};

const verifyPayment = async (paymentId: string) => {
  const payment = await orderUtils.verifyPayment(paymentId);

  if (payment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.paymentId': paymentId,
      },
      {
        'transaction.bank_status': payment[0].bank_status,
        'transaction.sp_code': payment[0].sp_code,
        'transaction.sp_message': payment[0].sp_message,
        'transaction.method': payment[0].method,
        'transaction.date_time': payment[0].date_time,
        'transaction.transactionStatus': payment[0].transaction_status,
        status:
          payment[0].bank_status == 'Success'
            ? 'paid'
            : payment[0].bank_status == 'Failed'
              ? 'pending'
              : payment[0].bank_status == 'Cancel'
                ? 'cancelled'
                : '',
      },
    );
  }

  if (payment[0].bank_status === 'Success') {
    // check if order was placed before
    const orderExists = await OrderModel.findOne({
      'transaction.paymentId': paymentId,
    });

    if (!orderExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Order was not placed correctly',
      );
    }

    const bookExists = await BookModel.isBookExists(
      orderExists.product as unknown as string,
    );

    if (!bookExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Product was not found in order',
      );
    }

    const remainingQuantity = bookExists.quantity - orderExists.quantity;

    // update book quantity (first transaction)
    const updatedBook = await BookModel.findOneAndUpdate(
      { _id: orderExists.product },
      {
        quantity: remainingQuantity,
        inStock: remainingQuantity > 0 ? true : false,
      },
      { new: true },
    );

    if (!updatedBook) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update book stock');
    }
  }

  return payment;
};

const calculateTotalRevenue = async () => {
  const result = await OrderModel.aggregate([
    // stage 1
    {
      $lookup: {
        from: 'books',
        localField: 'product',
        foreignField: '_id',
        as: 'bookDetails',
      },
    },

    // stage 2
    {
      $unwind: {
        path: '$bookDetails',
      },
    },

    // stage 3
    {
      $addFields: {
        totalPrice: { $multiply: ['$bookDetails.price', '$quantity'] },
      },
    },

    // stage 4
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },

    // Stage 5
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  if (result.length > 0) {
    return result[0].totalRevenue;
  } else {
    return 0;
  }
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(OrderModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await orderQuery.modelQuery.populate('user').populate('product');
  const meta = await orderQuery.countTotal();
  return {
    data,
    meta,
  };
};

const getMyOrdersFromDB = async (userId: string) => {
  const result = await OrderModel.find({ user: userId })
    .populate('user')
    .populate('product');
  return result;
};
const changeOrderStatus = async (id: string, payload: { status: string }) => {
  const orderExists = await OrderModel.findById(id);
  if (!orderExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (
    orderExists.status === 'paid' ||
    orderExists.status === 'delivered' ||
    orderExists.status == 'shipped'
  ) {
    if (payload.status === 'pending' || payload.status === 'cancelled') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order already ${orderExists.status}`,
      );
    }
  }

  if (orderExists.status === 'shipped') {
    if (payload.status !== 'delivered') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order already ${orderExists.status}`,
      );
    }
  }

  if (orderExists.status === 'delivered') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order already ${orderExists.status}`,
    );
  }

  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  calculateTotalRevenue,
  getAllOrdersFromDB,
  getMyOrdersFromDB,
  changeOrderStatus,
  verifyPayment,
};
