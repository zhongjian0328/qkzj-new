

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  sales: string;
  description?: string;
  specifications?: string;
  stock?: number;
}

interface ProductDetailModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  isLoading: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isLoading,
}) => {
  if (!product) return null;

  const handleClosePress = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleAddToCartPress = useCallback(() => {
    if (!isLoading) {
      onAddToCart(product.id);
    }
  }, [onAddToCart, product.id, isLoading]);

  const handleBuyNowPress = useCallback(() => {
    if (!isLoading) {
      onBuyNow(product.id);
    }
  }, [onBuyNow, product.id, isLoading]);

  const handleBackdropPress = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClosePress}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* 拖拽指示器 */}
            <View style={styles.dragIndicator} />
            
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* 头部 */}
              <View style={styles.header}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClosePress}
                  disabled={isLoading}
                >
                  <FontAwesome6 name="xmark" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>

              {/* 商品图片 */}
              <Image source={{ uri: product.image }} style={styles.productImage} />

              {/* 价格和销量 */}
              <View style={styles.priceSection}>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.sales}>{product.sales}</Text>
              </View>

              {/* 商品介绍 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>商品介绍</Text>
                <Text style={styles.sectionContent}>{product.description}</Text>
              </View>

              {/* 规格参数 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>规格参数</Text>
                <Text style={styles.sectionContent}>{product.specifications}</Text>
              </View>

              {/* 库存状态 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>库存状态</Text>
                <Text style={styles.stockText}>
                  现货充足 ({product.stock}件)
                </Text>
              </View>

              {/* 底部按钮 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.addToCartButton, isLoading && styles.buttonDisabled]}
                  onPress={handleAddToCartPress}
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

                <TouchableOpacity
                  style={[styles.buyNowButton, isLoading && styles.buttonDisabled]}
                  onPress={handleBuyNowPress}
                  disabled={isLoading}
                >
                  <Text style={styles.buyNowText}>立即购买</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProductDetailModal;

