USE test_db;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL
)

CREATE TABLE IF NOT EXISTS `post` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NOT NULL, 
    `userId` INT NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
)
