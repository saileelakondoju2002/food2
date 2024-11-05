import { 
  collection, 
  addDoc,
  doc,
  updateDoc,
  query, 
  where, 
  getDocs,
  getDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderStatus } from '../models/Order';

export class OrderService {
  private static instance: OrderService;
  private readonly ordersCollection = 'orders';

  private constructor() {}

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async createOrder(order: Order): Promise<string> {
    try {
      const ordersRef = collection(db, this.ordersCollection);
      const docRef = await addDoc(ordersRef, {
        ...order,
        createdAt: Timestamp.fromDate(order.createdAt),
        estimatedDeliveryTime: order.estimatedDeliveryTime ? Timestamp.fromDate(order.estimatedDeliveryTime) : null
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersRef = collection(db, this.ordersCollection);
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        estimatedDeliveryTime: doc.data().estimatedDeliveryTime?.toDate()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        return null;
      }

      return {
        id: orderDoc.id,
        ...orderDoc.data(),
        createdAt: orderDoc.data().createdAt.toDate(),
        estimatedDeliveryTime: orderDoc.data().estimatedDeliveryTime?.toDate()
      } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: 'completed' | 'failed'): Promise<void> {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, { 
        paymentStatus,
        status: paymentStatus === 'completed' ? 'confirmed' : 'cancelled'
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
}