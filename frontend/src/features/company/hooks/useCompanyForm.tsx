import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    companyRegistrationSchema,
    type CompanyRegistrationFormData
} from '../schemas/companySchema';
import type { City, Country } from '../../../types/location.types';
import { locationService } from '../../../api/services/locationService';

export const useCompanyForm = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [locationError, setLocationError] = useState<string>('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<CompanyRegistrationFormData>({
        resolver: zodResolver(companyRegistrationSchema),
        defaultValues: {
            name: '',
            address: '',
            countryId: 0,
            cityId: 0,
            latitude: null,
            longitude: null,
        },
        mode: 'onChange',
    });

    const countryId = watch('countryId');

    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoadingCountries(true);
            try {
                const data = await locationService.getCountries();
                setCountries(data);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
                setLocationError('Failed to load countries');
            } finally {
                setIsLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (countryId && countryId > 0) {
            const fetchCities = async () => {
                setIsLoadingCities(true);
                try {
                    const data = await locationService.getCitiesByCountry(countryId);
                    setCities(data);
                    setValue('cityId', 0);
                } catch (error) {
                    console.error('Failed to fetch cities:', error);
                    setLocationError('Failed to load cities');
                } finally {
                    setIsLoadingCities(false);
                }
            };
            fetchCities();
        } else {
            setCities([]);
            setValue('cityId', 0);
        }
    }, [countryId, setValue]);

    const setLocation = (latitude: number, longitude: number) => {
        setValue('latitude', latitude, { shouldValidate: true });
        setValue('longitude', longitude, { shouldValidate: true });
    };

    const getLocation = (): [number, number] | null => {
        const lat = getValues('latitude');
        const lng = getValues('longitude');
        return lat !== null && lng !== null ? [lat, lng] : null;
    };

    return {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        errors,

        countries,
        cities,
        isLoadingCountries,
        isLoadingCities,
        locationError,

        setLocation,
        getLocation,
    };
};