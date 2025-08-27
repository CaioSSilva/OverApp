import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { dataService } from '../hooks/data';
import { Map } from '../interfaces/Map.model';
import MapCard from '../components/MapCard';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';
import { COLORS, getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';
import { IterationCw } from 'lucide-react-native';

export default function Maps() {
  const isDarkMode = useColorScheme() === 'dark';
  const { getMaps } = dataService();
  const [maps, setMaps] = useState<Map[]>([]);
  const { t } = useTranslation();

  const getMapsList = useCallback(() => dataService().getMaps(), []);

  useEffect(() => {
    getMapsList().then(setMaps);
  }, [getMapsList]);

  function updateMaps() {
    setMaps([]);
    getMaps().then(setMaps);
  }

  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <View style={getThemedStyles(isDarkMode).header}>
        <View>
          <Text
            style={[getThemedStyles(isDarkMode).text, getThemedStyles(isDarkMode).headerTitle]}
          >
            {t('maps.title')}
          </Text>
          <Text
            style={[getThemedStyles(isDarkMode).text,getThemedStyles(isDarkMode).headerSubtitle]}
          >
            {t('maps.allMaps')}
          </Text>
        </View>

        <Button onPress={() => updateMaps()} icon={<IterationCw size={20} color={COLORS.WHITE} />} />
      </View>
      {maps.length > 0 ? (
        <FlatList
          data={maps}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => <MapCard map={item} />}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          windowSize={20}
        />
      ) : (
        <Skeleton height={200} count={5} />
      )}
    </View>
  );
}