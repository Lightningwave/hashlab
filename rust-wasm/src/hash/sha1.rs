use sha1::{Digest, Sha1};

/// Hash raw bytes and return hex string (SHA-1)
pub fn hash(input: &[u8]) -> String {
    let mut hasher = Sha1::new();
    hasher.update(input);
    let result = hasher.finalize();
    hex::encode(result)
}

/// Hash a string and return hex string (SHA-1)
pub fn hash_string(input: &str) -> String {
    hash(input.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sha1_empty() {
        assert_eq!(hash_string(""), "da39a3ee5e6b4b0d3255bfef95601890afd80709");
    }

    #[test]
    fn test_sha1_hello() {
        assert_eq!(hash_string("hello"), "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
    }
}


