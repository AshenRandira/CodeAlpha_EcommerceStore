import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CartContext from './cartContext.js';

const CART_STORAGE_KEY = 'codealpha_cart';

function normalizeProductSnapshot(product) {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const rawProductId = product.productId ?? product._id;
  const productId =
    typeof rawProductId === 'string' ? rawProductId.trim() : '';
  const name =
    typeof product.name === 'string' ? product.name.trim() : '';
  const imageUrl =
    typeof product.imageUrl === 'string' ? product.imageUrl.trim() : '';

  if (
    !productId ||
    !name ||
    !imageUrl ||
    !Number.isFinite(product.price) ||
    product.price < 0 ||
    !Number.isInteger(product.stock) ||
    product.stock <= 0
  ) {
    return null;
  }

  return {
    productId,
    name,
    imageUrl,
    price: product.price,
    stock: product.stock,
  };
}

function normalizeQuantity(quantity, stock) {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity)) {
    return 1;
  }

  return Math.min(
    stock,
    Math.max(1, Math.trunc(numericQuantity)),
  );
}

function reconcileStoredCart(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const itemsByProductId = new Map();

  for (const rawItem of value) {
    const product = normalizeProductSnapshot(rawItem);

    if (!product || !Number.isInteger(rawItem.quantity)) {
      continue;
    }

    const quantity = normalizeQuantity(
      rawItem.quantity,
      product.stock,
    );

    const existingItem = itemsByProductId.get(product.productId);

    const mergedQuantity = existingItem
      ? normalizeQuantity(
          existingItem.quantity + quantity,
          product.stock,
        )
      : quantity;

    itemsByProductId.set(product.productId, {
      ...product,
      quantity: mergedQuantity,
    });
  }

  return Array.from(itemsByProductId.values());
}

function loadStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    return reconcileStoredCart(JSON.parse(storedCart));
  } catch {
    return [];
  }
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadStoredCart);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems),
      );

      setStorageError('');
    } catch {
      setStorageError(
        'Your cart is available for this session, but it could not be saved.',
      );
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    const productSnapshot = normalizeProductSnapshot(product);

    if (!productSnapshot) {
      return false;
    }

    const quantityToAdd = normalizeQuantity(
      quantity,
      productSnapshot.stock,
    );

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productSnapshot.productId,
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            ...productSnapshot,
            quantity: quantityToAdd,
          },
        ];
      }

      return currentItems.map((item) => {
        if (item.productId !== productSnapshot.productId) {
          return item;
        }

        return {
          ...productSnapshot,
          quantity: normalizeQuantity(
            item.quantity + quantityToAdd,
            productSnapshot.stock,
          ),
        };
      });
    });

    return true;
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (typeof productId !== 'string' || !productId.trim()) {
        return false;
      }

      const numericQuantity = Number(quantity);

      if (!Number.isFinite(numericQuantity)) {
        return false;
      }

      setCartItems((currentItems) =>
        currentItems.map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: normalizeQuantity(
              numericQuantity,
              item.stock,
            ),
          };
        }),
      );

      return true;
    },
    [],
  );

  const removeFromCart = useCallback((productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const itemCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      roundCurrency(
        cartItems.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0,
        ),
      ),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      storageError,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      cartItems,
      itemCount,
      subtotal,
      storageError,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
