DELIMITER //
CREATE PROCEDURE GenerateUsers(
    IN start_index INT,
    IN total_records INT
)
BEGIN
    DECLARE i INT DEFAULT start_index;
    DECLARE max_index INT DEFAULT start_index + total_records - 1;
    
    WHILE i <= max_index DO
        INSERT INTO users (email, username, first_name, last_name, age, password_hash)
        VALUES (
            CONCAT('user', i, '@example.com'),
            CONCAT('user', i),
            ELT(1 + (i % 10), 'John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy'),
            ELT(1 + (i % 10), 'Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'),
            13 + (i % 45),
            SHA2(CONCAT('Password', i), 256)
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- Generate first 500 records
CALL GenerateUsers(1, 500);

-- Generate next 9500 records (total 10,000)
CALL GenerateUsers(501, 9500);

-- Remove procedure when done
DROP PROCEDURE GenerateUsers;

-- RUN
CALL GenerateUsers(1, 10000);