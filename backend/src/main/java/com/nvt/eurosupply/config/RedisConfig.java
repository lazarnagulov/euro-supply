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
        Map<String, RedisCacheConfiguration> cacheConfigurations  = Map.of(
                "countries", baseConfig(serializer, Duration.ofHours(12)),
                "countryCities", baseConfig(serializer, Duration.ofHours(12)),
                "vehicleModels", baseConfig(serializer, Duration.ofHours(12)),
                "vehicleBrands", baseConfig(serializer, Duration.ofHours(12)),
                "categories", baseConfig(serializer, Duration.ofHours(12)),
                "cities", baseConfig(serializer, Duration.ofHours(12)),
                "vehicle", baseConfig(serializer, Duration.ofMinutes(2)),
                "vehicles", baseConfig(serializer, Duration.ofMinutes(1)),
                "vehicleLocation", baseConfig(serializer, Duration.ofSeconds(30)),
                "vehicleStatus", baseConfig(serializer, Duration.ofSeconds(30))
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

