import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { dataService } from '../hooks/data';
import { Map } from '../interfaces/Map.model';
import MapCard from '../components/MapCard';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';
import { getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';

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
      <View style={mapsStyles.mapsTitleContainer}>
        <View>
          <Text
            style={[getThemedStyles(isDarkMode).text, mapsStyles.mapsTitle]}
          >
            {t('maps.title')}
          </Text>
          <Text
            style={[getThemedStyles(isDarkMode).text, mapsStyles.mapsSubtitle]}
          >
            {t('maps.allMaps')}
          </Text>
        </View>

        <Button onPress={() => updateMaps()} title={t('common.update')} />
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

const mapsStyles = StyleSheet.create({
  mapsTitleContainer: {
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mapsTitle: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 16,
  },

  mapsSubtitle: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 16,
  },
});
