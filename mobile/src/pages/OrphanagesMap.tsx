import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

import local from '../../assets/images/Local.png'
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
}

export default function OrphanagesMap() {

    const navigation = useNavigation();
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    async function getOrphanages() {
        const response = await api.get('api/v1/orphanages');
        setOrphanages(response.data);
    }

    useFocusEffect(() => {
        getOrphanages();
    });

    function handleNavigateToOrphanageDetail(id: number) {
        navigation.navigate('OrphanagesDetails', { id });
    }

    function handleNavigateToSelectMapPosition() {
        navigation.navigate('SelectMapPosition');
    }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: -23.739437,
                    longitude: -46.6923329,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
                style={styles.map}
            >
                {orphanages.map((orphanage) => {
                    return (
                        <Marker
                            key={orphanage.id}
                            icon={local}
                            calloutAnchor={{ x: 2.7, y: 0.8 }}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude
                            }}
                        >
                            <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetail(orphanage.id)}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>


            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
                <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToSelectMapPosition}>
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + Constants.statusBarHeight,
    },
    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        justifyContent: 'center',
        elevation: 3,
    },
    calloutText: {
        fontFamily: 'Raleway_700Bold',
        color: '#0089a5',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,
        backgroundColor: '#FFF',
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
    },
    footerText: {
        fontFamily: 'Raleway_700Bold',
        color: '#8fa7b3',
    },
    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
