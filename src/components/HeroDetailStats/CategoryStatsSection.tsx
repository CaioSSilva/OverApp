import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Category } from '../../interfaces/Details.model';

interface CategoryStatsSectionProps {
  categories: Category[];
  formatters: any;
  getStatIcon: (key: string) => string;
  isDarkMode: boolean;
}

const CategoryStatsSection = React.memo<CategoryStatsSectionProps>(({ 
  categories, 
  formatters, 
  getStatIcon, 
  isDarkMode 
}) => {
  const { t } = useTranslation();
  const themeColors = useMemo(() => ({
    sectionTitle: isDarkMode ? '#ffffff' : '#1f2937',
    cardBg: isDarkMode ? '#1e1e1e' : '#f8f9fa',
    borderBottom: isDarkMode ? '#404040' : '#e5e7eb',
    label: isDarkMode ? '#ffffff' : '#374151',
  }), [isDarkMode]);

  const titleStyle = useMemo(() => ({
    ...styles.sectionTitle,
    color: themeColors.sectionTitle
  }), [themeColors.sectionTitle]);

  const cardStyle = useMemo(() => ({
    ...styles.specialStats,
    backgroundColor: themeColors.cardBg
  }), [themeColors.cardBg]);

  const borderStyle = useMemo(() => ({
    ...styles.specialStatRow,
    borderBottomColor: themeColors.borderBottom
  }), [themeColors.borderBottom]);

  const labelStyle = useMemo(() => ({
    ...styles.specialStatLabel,
    color: themeColors.label
  }), [themeColors.label]);

  return (
    <>
      {categories.map((category, categoryIndex) => {
        const statsToShow = category.stats.slice(0, 6);
        if (statsToShow.length === 0) return null;

        const sectionTitle = 
          category.label === 'Hero Specific' ? t('specialSkills') :
          category.label === 'Best' ? t('bestPerformances') :
          category.label === 'Average' ? t('averages') :
          category.label || category.category;

        return (
          <View key={`category-${categoryIndex}`} style={styles.section}>
            <Text style={titleStyle}>{sectionTitle}</Text>
            <View style={cardStyle}>
              {statsToShow.map((stat, statIndex) => (
                <View key={`stat-${statIndex}`} style={borderStyle}>
                  <Text style={labelStyle}>
                    {getStatIcon(stat.key)} {stat.label}
                  </Text>
                  <Text style={styles.specialStatValue}>
                    {typeof stat.value === 'number'
                      ? formatters.number(stat.value)
                      : stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
});

const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  specialStats: {
    borderRadius: 8,
    padding: 12,
  },
  specialStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  specialStatLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  specialStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
});

export default CategoryStatsSection;
