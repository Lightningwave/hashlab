pub fn encode(text: &str) -> String {
    hex::encode(text.as_bytes())
}

pub fn decode(text: &str) -> Result<String, String> {
    match hex::decode(text) {
        Ok(bytes) => match String::from_utf8(bytes) {
            Ok(s) => Ok(s),
            Err(_) => Err("Decoded bytes are not UTF-8".to_string()),
        },
        Err(_) => Err("Invalid hex input".to_string()),
    }
}

