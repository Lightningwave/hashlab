pub fn encode(text: &str) -> String {
    urlencoding::encode(text).to_string()
}

pub fn decode(text: &str) -> Result<String, String> {
    match urlencoding::decode(text) {
        Ok(s) => Ok(s.to_string()),
        Err(_) => Err("Invalid URL encoding".to_string()),
    }
}

