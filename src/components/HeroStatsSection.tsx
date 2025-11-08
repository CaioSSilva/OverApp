import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getThemedStyles } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Hero } from '../interfaces/Hero.model';
import { dataService } from '../hooks/data';
import { HeroStatsResponse } from '../interfaces/Status.model';
import HeroCard from './HeroCard/HeroCard';
import Skeleton from './Skeleton';
import React from 'react';
import { AppContext } from '../contexts/AppContext';

interface StatsSectionProps {
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  refreshing?: boolean;
}

export default function HeroStatsSection({
  setScrollEnabled,
  refreshing,
}: StatsSectionProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const { User } = useContext(AppContext);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [status, setStatus] = useState<HeroStatsResponse | null>(null);

  const getHeroList = useCallback(() => dataService().getHeroes(), []);

  const setScroll = (value: boolean) => {
    setScrollEnabled(value);
  };

  useEffect(() => {
    getHeroList().then(setHeroes);
  }, [getHeroList, refreshing]);

  useEffect(() => {
    setItemsCharDrop([
      {
        label: t('characters.allCharacters'),
        value: '',
      },
      ...heroes.map(hero => ({
        label: hero.name,
        value: hero.key,
      })),
    ]);
  }, [heroes, t]);

  const [openCharDrop, setOpenCharDrop] = useState(false);
  const [itemsCharDrop, setItemsCharDrop] = useState<
    { label: string; value: string }[]
  >([]);
  const [valueCharDrop, setValueCharDrop] = useState<string | null>('');

  const gamemodeItems = [
    { label: t('stats.quickplay'), value: 'quickplay' },
    { label: t('stats.competitive'), value: 'competitive' },
  ];

  const [openModeDrop, setOpenModeDrop] = useState(false);
  const [valueModeDrop, setValueModeDrop] = useState(gamemodeItems[0].value);
  const [itemsModeDrop, setItemsModeDrop] =
    useState<{ label: string; value: string }[]>(gamemodeItems);

  const platformItems = [
    { label: 'PC', value: 'pc' },
    { label: 'Console', value: 'console' },
  ];

  const [openPlatDrop, setOpenPlatDrop] = useState(false);
  const [valuePlatDrop, setValuePlatDrop] = useState(platformItems[0].value);
  const [itemsPlatDrop, setItemsPlatDrop] =
    useState<{ label: string; value: string }[]>(platformItems);

  const getStatus = useCallback(
    () =>
      dataService().getStatusByHero(
        valueModeDrop,
        valuePlatDrop,
        valueCharDrop!,
        User?.name,
      ),
    [valueModeDrop, valuePlatDrop, valueCharDrop, User?.name],
  );

  return (
    <>
      <View style={sectionStyles.hr}>
        <View style={sectionStyles.charactersHeader}>
          <Text
            style={[
              getThemedStyles(isDarkMode).text,
              styles.title,
              sectionStyles.charactersText,
            ]}
          >
            {t('characters.title')}
          </Text>
        </View>
        <DropDownPicker
          open={openCharDrop}
          value={valueCharDrop}
          items={itemsCharDrop}
          setOpen={() => {
            setOpenCharDrop(true);
            setOpenModeDrop(false);
            setOpenPlatDrop(false);
            setScroll(false);
          }}
          onClose={() => {
            setOpenCharDrop(false);
            setScroll(true);
          }}
          setValue={setValueCharDrop}
          setItems={setItemsCharDrop}
          loading={heroes.length === 0}
          onChangeValue={() => {
            setStatus(null);
            getStatus().then(setStatus);
          }}
          placeholder={t('characters.selectCharacter')}
          disabled={valueCharDrop === null}
          style={sectionStyles.charactersDropDownSel}
          dropDownContainerStyle={sectionStyles.charactersDropDown}
          scrollViewProps={{ nestedScrollEnabled: true }}
        />
        <DropDownPicker
          open={openPlatDrop}
          value={valuePlatDrop}
          items={itemsPlatDrop}
          setOpen={() => {
            setOpenPlatDrop(true);
            setOpenCharDrop(false);
            setOpenModeDrop(false);
            setScroll(false);
          }}
          onClose={() => {
            setOpenPlatDrop(false);
            setScroll(true);
          }}
          setValue={setValuePlatDrop}
          setItems={setItemsPlatDrop}
          onChangeValue={() => {
            setStatus(null);
            getStatus().then(setStatus);
          }}
          placeholder={t('stats.selectPlatform')}
          style={sectionStyles.charactersDropDownSel}
          dropDownContainerStyle={[
            sectionStyles.charactersDropDown,
            sectionStyles.platformDropDownSel,
          ]}
        />
        <DropDownPicker
          open={openModeDrop}
          value={valueModeDrop}
          items={itemsModeDrop}
          setOpen={() => {
            setOpenModeDrop(true);
            setOpenCharDrop(false);
            setOpenPlatDrop(false);
            setScroll(false);
          }}
          onClose={() => {
            setOpenModeDrop(false);
            setScroll(true);
          }}
          setValue={setValueModeDrop}
          setItems={setItemsModeDrop}
          onChangeValue={() => {
            setStatus(null);
            getStatus().then(setStatus);
          }}
          placeholder={t('stats.selectGamemode')}
          style={sectionStyles.charactersDropDownSel}
          dropDownContainerStyle={[
            sectionStyles.charactersDropDown,
            sectionStyles.platformDropDownSel,
          ]}
        />
      </View>
      {status ? (
        valueCharDrop ? (
          <HeroCard
            hero={heroes.find(c => c.key === valueCharDrop)!}
            status={status}
          />
        ) : (
          heroes.map((hero, i) => (
            <HeroCard key={i} hero={hero} status={status} />
          ))
        )
      ) : (
        <Skeleton height={90} count={valueCharDrop ? 1 : 10} />
      )}
    </>
  );
}

const sectionStyles = StyleSheet.create({
  charactersHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  charactersText: {
    marginLeft: '30%',
  },

  charactersDropDownSel: {
    margin: 'auto',
    marginTop: 10,
  },
  charactersDropDown: {
    position: 'static',
    borderRadius: 10,
    height: 200,
  },
  platformDropDownSel: {
    height: 80,
  },
  hr: {
    margin: 'auto',
    width: '95%',
    paddingBottom: 10,
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
  },
});
