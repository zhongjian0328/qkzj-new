import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
                  {isSelected && <Ionicons name="checkmark" size={20} color="#2DBBA1" />}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionSelected: {
    backgroundColor: '#E6F7F3',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#2DBBA1',
    fontWeight: '600',
  },
});

export default PickerModal;
