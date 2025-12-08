

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  logoSection: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6A5A',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(43, 106, 90, 0.8)',
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: -24,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 32,
  },
  tabButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#3BCCA5',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3BCCA5',
  },
  formContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  codeInputWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  codeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3BCCA5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  codeButtonDisabled: {
    backgroundColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  codeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  codeButtonTextDisabled: {
    color: '#6B7280',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordToggleButton: {
    paddingHorizontal: 12,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  submitButtonGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6A5A',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3BCCA5',
  },
  agreementSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  agreementText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
  agreementLink: {
    color: '#3BCCA5',
  },
  toastContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toastText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  experienceSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  experienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3BCCA5',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  experienceButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3BCCA5',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

