import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatCardProps } from '../../interfaces/Details.model';

const StatCard = React.memo<StatCardProps>(
  ({ title, value, subtitle, color = '#3B82F6', icon, isDarkMode = false }) => {
    const cardStyles = useMemo(
      () => ({
        card: {
          ...styles.card,
          borderLeftColor: color,
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        },
        title: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        },
        subtitle: {
          color: isDarkMode ? '#6b7280' : '#9ca3af',
        },
      }),
      [color, isDarkMode],
    );

    return (
      <View style={cardStyles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, cardStyles.title]}>{title}</Text>
          {icon && <Text style={styles.cardIcon}>{icon}</Text>}
        </View>
        <Text style={[styles.cardValue, { color }]}>{value}</Text>
        {subtitle && (
          <Text style={[styles.cardSubtitle, cardStyles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 10,
    flex: 0.48,
    borderLeftWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardIcon: {
    fontSize: 12,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 9,
  },
});

export default StatCard;
