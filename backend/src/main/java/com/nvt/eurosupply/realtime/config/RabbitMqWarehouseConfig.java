package com.nvt.eurosupply.realtime.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqWarehouseConfig {

    @Bean
    public TopicExchange warehouseHeartbeatExchange() {
        return new TopicExchange("warehouse.heartbeat", true, false);
    }

    @Bean
    public TopicExchange warehouseTemperatureExchange() {
        return new TopicExchange("warehouse.temperature", true, false);
    }

    @Bean
    public Queue warehouseHeartbeatQueue() {
        return new Queue("warehouse.heartbeat.queue", true);
    }

    @Bean
    public Queue warehouseTemperatureQueue() {
        return new Queue("warehouse.temperature.queue", true);
    }

    @Bean
    public Binding warehouseHeartbeatBinding(
            Queue warehouseHeartbeatQueue,
            TopicExchange warehouseHeartbeatExchange) {

        return BindingBuilder
                .bind(warehouseHeartbeatQueue)
                .to(warehouseHeartbeatExchange)
                .with("warehouse.*.heartbeat");
    }

    @Bean
    public Binding warehouseTemperatureBinding(
            Queue warehouseTemperatureQueue,
            TopicExchange warehouseTemperatureExchange) {

        return BindingBuilder
                .bind(warehouseTemperatureQueue)
                .to(warehouseTemperatureExchange)
                .with("warehouse.*.temperatures");
    }
}
