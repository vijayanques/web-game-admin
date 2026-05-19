-- Logos Management Table
CREATE TABLE IF NOT EXISTS logos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('header', 'footer') NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    link_url VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default entries
INSERT INTO logos (type, url, alt_text, link_url, is_active) VALUES
('header', '', 'Header Logo', '/', 1),
('footer', '', 'Footer Logo', '/', 1)
ON DUPLICATE KEY UPDATE type=type;
