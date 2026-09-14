UPDATE admins
SET email = 'autotokyo68@gmail.com',
    updated_at = CURRENT_TIMESTAMP
WHERE id = (SELECT MIN(id) FROM admins)
  AND (SELECT COUNT(*) FROM admins) = 1;
