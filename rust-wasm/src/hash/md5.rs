
/// Hash raw bytes and return hex string
pub fn hash(input: &[u8]) -> String {
    let digest = md5::compute(input);
    format!("{:x}", digest)
}

/// Hash a string and return hex string
pub fn hash_string(input: &str) -> String {
    hash(input.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_md5_empty() {
        assert_eq!(hash_string(""), "d41d8cd98f00b204e9800998ecf8427e");
    }

    #[test]
    fn test_md5_hello() {
        assert_eq!(hash_string("hello"), "5d41402abc4b2a76b9719d911017c592");
    }

    #[test]
    fn test_md5_bytes() {
        assert_eq!(hash(b"test"), "098f6bcd4621d373cade4e832627b4f6");
    }
}