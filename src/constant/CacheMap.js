const CacheMap = {
    // 邮箱锁定前缀
    EMAIL_LOCK_PREFIX: function(email, type) {
        return "email_lock_" + type + "_" + email; 
    },
}

module.exports = CacheMap;