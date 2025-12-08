

import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side + 16px gap between cards

export default StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceAndSales: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },
  productSales: {
    fontSize: 12,
    color: '#6B7280',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BCCA5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 36,
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  cartIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

