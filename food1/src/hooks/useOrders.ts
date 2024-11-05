import { useState, useEffect } from 'react';
import { Order } from '../models/Order';
import { OrderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const orderService = OrderService.getInstance();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await orderService.getUserOrders(currentUser.uid);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const refreshOrders = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userOrders = await orderService.getUserOrders(currentUser.uid);
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      setError('Failed to refresh orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refreshOrders };
}