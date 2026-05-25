-- Fix corrupted password hash
-- Password: password123 (BCrypt encoded with strength 10)
UPDATE "USER" 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBS5V2'
WHERE email = 'jameslytech@gmail.com';
