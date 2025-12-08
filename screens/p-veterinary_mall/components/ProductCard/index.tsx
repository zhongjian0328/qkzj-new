

import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  sales: string;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  isLoading: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  isLoading,
}) => {
  const handleCardPress = useCallback(() => {
    if (!isLoading) {
      onPress();
    }
  }, [onPress, isLoading]);

  const handleAddToCartPress = useCallback(() => {
    if (!isLoading) {
      onAddToCart();
    }
  }, [onAddToCart, isLoading]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.95}
      disabled={isLoading}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceAndSales}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Text style={styles.productSales}>{product.sales}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.addToCartButton, isLoading && styles.addToCartButtonDisabled]}
          onPress={handleAddToCartPress}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome6 name="cart-shopping" style={styles.cartIcon} />
              <Text style={styles.addToCartText}>加入购物车</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

