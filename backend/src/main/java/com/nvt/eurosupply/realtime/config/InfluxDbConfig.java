package com.nvt.eurosupply.realtime.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDbConfig {

    @Value("${influxdb.host}")
    private String host;

    @Value("${influxdb.port}")
    private String port;

    @Value("${influxdb.token}")
    private String token;

    @Value("${influxdb.organization}")
    private String organization;

    @Value("${influxdb.bucket}")
    private String bucket;

    @Bean
    public InfluxDBClient influxDbClient() {
        String url = String.format("http://%s:%s", host, port);
        return InfluxDBClientFactory.create(url, token.toCharArray(), organization, bucket);
    }
}
