package com.nvt.eurosupply.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean("redisList")
    public ObjectMapper listMapper() {
        ObjectMapper listMapper = new ObjectMapper();
        listMapper.registerModule(new JavaTimeModule());
        return listMapper;
    }

    @Bean("redisObject")
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.nvt.eurosupply")
                .allowIfSubType("java.util")
                .allowIfSubType("java.time")
                .build();

        objectMapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.NON_FINAL);
        return objectMapper;
    }

    @Bean
    public RedisCacheManager cacheManager(
        RedisConnectionFactory connectionFactory,
        @Qualifier("redisList") ObjectMapper listMapper,
        @Qualifier("redisObject") ObjectMapper objectMapper
    ) {
        GenericJackson2JsonRedisSerializer listSerializer = new GenericJackson2JsonRedisSerializer(listMapper);
        GenericJackson2JsonRedisSerializer objectSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfig = baseConfig(objectSerializer, Duration.ofMinutes(10));

        Map<String, RedisCacheConfiguration> cacheConfigurations = Map.ofEntries(
            Map.entry("countries", baseConfig(listSerializer, Duration.ofHours(12))),
            Map.entry("countryCities", baseConfig(listSerializer, Duration.ofHours(12))),
            Map.entry("vehicleModels", baseConfig(listSerializer, Duration.ofHours(12))),
            Map.entry("vehicleBrands", baseConfig(listSerializer, Duration.ofHours(12))),
            Map.entry("categories", baseConfig(listSerializer, Duration.ofHours(12))),
            Map.entry("cities", baseConfig(listSerializer, Duration.ofHours(12))),


            Map.entry("vehicle", baseConfig(objectSerializer, Duration.ofMinutes(30))),
            Map.entry("vehicleExists", baseConfig(objectSerializer, Duration.ofMinutes(30))),

            Map.entry("factory", baseConfig(objectSerializer, Duration.ofMinutes(30))),
            Map.entry("factoryStatus", baseConfig(objectSerializer, Duration.ofSeconds(30))),

            Map.entry("product", baseConfig(objectSerializer, Duration.ofMinutes(30)))
        );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

    private RedisCacheConfiguration baseConfig(GenericJackson2JsonRedisSerializer serializer, Duration ttl) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(ttl)
                .disableCachingNullValues()
                .prefixCacheNameWith("eurosupply:")
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
    }

}