package com.nvt.eurosupply.config;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfig = baseConfig(serializer, Duration.ofMinutes(10));
        Map<String, RedisCacheConfiguration> cacheConfigurations =
                Map.ofEntries(
                        Map.entry("countries", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("countryCities", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("vehicleModels", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("vehicleBrands", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("categories", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("cities", baseConfig(serializer, Duration.ofHours(12))),
                        Map.entry("vehicle", baseConfig(serializer, Duration.ofMinutes(30))),
                        Map.entry("vehicleEntity", baseConfig(serializer, Duration.ofMinutes(30))),
                        Map.entry("vehicles", baseConfig(serializer, Duration.ofMinutes(30))),
                        Map.entry("vehicleLocation", baseConfig(serializer, Duration.ofSeconds(30))),
                        Map.entry("vehicleStatus", baseConfig(serializer, Duration.ofSeconds(30)))
                );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations )
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

