

import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: height * 0.8,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  dragIndicator: {
    width: 48,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  productTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 16,
    lineHeight: 28,
  },
  closeButton: {
    padding: 8,
    margin: -8,
  },
  closeIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  productImage: {
    width: '100%',
    height: 192,
    backgroundColor: '#F3F4F6',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginRight: 16,
  },
  sales: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  stockText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 8,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BCCA5',
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cartIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 4,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

