-- Manivtha Tours & Travels
-- AI Outstation Trip Risk Briefing Generator
-- MySQL Raw Database Schema

CREATE DATABASE IF NOT EXISTS `outstation_trip_risk_db`;
USE `outstation_trip_risk_db`;

-- 1. users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. generations Table
CREATE TABLE IF NOT EXISTS `generations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `admin_name` VARCHAR(255) NOT NULL,
  `route_from` VARCHAR(255) NOT NULL,
  `route_to` VARCHAR(255) NOT NULL,
  `season` VARCHAR(255) NOT NULL,
  `vehicle_type` VARCHAR(255) NOT NULL,
  `duration` VARCHAR(255) NOT NULL,
  `notes` TEXT NULL,
  `selected_model` VARCHAR(255) NOT NULL,
  `ai_response` LONGTEXT NOT NULL,
  `response_time_ms` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_generations_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. feedback Table
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `generation_id` INT NOT NULL UNIQUE,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `liked` BOOLEAN NOT NULL DEFAULT TRUE,
  `comment` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_feedback_generations` FOREIGN KEY (`generation_id`) REFERENCES `generations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. templates Table
CREATE TABLE IF NOT EXISTS `templates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `template_name` VARCHAR(255) NOT NULL,
  `route_from` VARCHAR(255) NOT NULL,
  `route_to` VARCHAR(255) NOT NULL,
  `season` VARCHAR(255) NOT NULL,
  `vehicle_type` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Pre-seed Data for templates
INSERT INTO `templates` (`template_name`, `route_from`, `route_to`, `season`, `vehicle_type`) VALUES
('Hyderabad ➔ Bangalore Express', 'Hyderabad', 'Bangalore', 'Monsoon', 'Volvo AC Sleeper'),
('Hyderabad ➔ Chennai Coastal Highway', 'Hyderabad', 'Chennai', 'Summer', 'Innova Crysta SUV'),
('Hyderabad ➔ Goa Ghat Route', 'Hyderabad', 'Goa', 'Winter', 'Force Traveler'),
('Hyderabad ➔ Mumbai Commercial Corridor', 'Hyderabad', 'Mumbai', 'Monsoon', 'BharatBenz Sleeper Coach');
