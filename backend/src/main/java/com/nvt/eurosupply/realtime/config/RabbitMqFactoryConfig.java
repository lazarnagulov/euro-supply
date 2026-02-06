package com.nvt.eurosupply.realtime.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqFactoryConfig {

    @Bean
    public TopicExchange factoryHeartbeatExchange() {
        return new TopicExchange("factory.heartbeat", true, false);
    }

    @Bean
    public TopicExchange factoryProductionExchange() {
        return new TopicExchange("factory.production", true, false);
    }

    @Bean
    public Queue factoryHeartbeatQueue() {
        return new Queue("factory.heartbeat.queue", true);
    }

    @Bean
    public Queue factoryProductionQueue() {
        return new Queue("factory.production.queue", true);
    }

    @Bean
    public Binding factoryHeartbeatBinding(
            Queue factoryHeartbeatQueue,
            TopicExchange factoryHeartbeatExchange) {

        return BindingBuilder
                .bind(factoryHeartbeatQueue)
                .to(factoryHeartbeatExchange)
                .with("factory.*.heartbeat");
    }

    @Bean
    public Binding factoryProductionBinding(
            Queue factoryProductionQueue,
            TopicExchange factoryProductionExchange) {

        return BindingBuilder
                .bind(factoryProductionQueue)
                .to(factoryProductionExchange)
                .with("factory.*.production");
    }
}
