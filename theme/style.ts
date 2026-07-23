import { StyleSheet } from 'react-native';
import COLORS from './colors';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 5,
  },
});

export default GlobalStyles;
