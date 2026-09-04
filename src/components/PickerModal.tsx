import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const PickerModal: React.FC<PickerModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={pickerStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={pickerStyles.sheet} onStartShouldSetResponder={() => true}>
          <View style={pickerStyles.handle} />
          <Text style={pickerStyles.title}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  style={[pickerStyles.option, isSelected && pickerStyles.optionSelected]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <Text style={[pickerStyles.optionText, isSelected && pickerStyles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlayLight,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: typography.size.bodyLarge,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});

export default PickerModal;
