use sha2::{Digest, Sha512};

/// Hash raw bytes and return hex string (SHA-512)
pub fn hash(input: &[u8]) -> String {
    let mut hasher = Sha512::new();
    hasher.update(input);
    let result = hasher.finalize();
    hex::encode(result)
}

/// Hash a string and return hex string (SHA-512)
pub fn hash_string(input: &str) -> String {
    hash(input.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sha512_empty() {
        assert_eq!(hash_string(""),
        "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e");
    }

    #[test]
    fn test_sha512_hello() {
        assert_eq!(hash_string("hello"),
        "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043");
    }
}


