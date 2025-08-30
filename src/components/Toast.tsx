import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from '@svipwrap/react-native-toast-message';
import React from 'react';
import { COLORS } from '../styles/theme';

const toastStyles = {
  contentContainer: {
    zIndex: 100,
  },
};

function SuccessToast(
  props: React.JSX.IntrinsicAttributes & BaseToastProps,
) {
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.PRIMARY,
        backgroundColor: COLORS.PRIMARY,
      }}
      contentContainerStyle={toastStyles.contentContainer}
      text1Style={{ color: COLORS.WHITE }}
      text2Style={{ color: COLORS.WHITE }}
    />
  );
}

function CustomErrorToast(
  props: React.JSX.IntrinsicAttributes & BaseToastProps,
) {
  return (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: COLORS.WARNING,
        backgroundColor: COLORS.WHITE,
      }}
      contentContainerStyle={toastStyles.contentContainer}
      text1Style={{ color: COLORS.PRIMARY }}
      text2Style={{ color: COLORS.ERROR }}
    />
  );
}

const createToastConfig = () => ({
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <SuccessToast {...props} />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomErrorToast {...props} />
  ),
});

export default function CustomToast() {
  const toastConfig = React.useMemo(
    () => createToastConfig(),
    [],
  );

  return <Toast config={toastConfig} />;
}
