package com.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiController {

	@Value("${huggingface.api.key}")
	private String apiKey;

	@PostMapping("/chat")
	public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {
		String prompt = body.get("prompt");

		if (prompt == null || prompt.isBlank()) {
			return ResponseEntity.badRequest().body("Prompt is required");
		}

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(apiKey);
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> payload = Map.of("model", "meta-llama/Llama-3.1-8B-Instruct:cerebras", "messages",
				List.of(Map.of("role", "system", "content",
						"You are a technical writer. Given an issue title, write a single clear action-oriented description sentence starting with. Keep it concise and professional."),
						Map.of("role", "user", "content", prompt)),
				"max_tokens", 100, "stream", false);

		HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

		try {
			String response = restTemplate.postForObject("https://router.huggingface.co/v1/chat/completions", request,
					String.class);

			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(response);
			String description = root.path("choices").get(0).path("message").path("content").asText();

			return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(description);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AI failed: " + e.getMessage());
		}
	}
	
	
	@PostMapping("/fix-grammar")
	public ResponseEntity<String> fixGrammar(@RequestBody Map<String, String> body) {
	    String text = body.get("text");

	    if (text == null || text.isBlank()) {
	        return ResponseEntity.badRequest().body("Text is required");
	    }

	    RestTemplate restTemplate = new RestTemplate();
	    HttpHeaders headers = new HttpHeaders();
	    headers.setBearerAuth(apiKey);
	    headers.setContentType(MediaType.APPLICATION_JSON);

	    Map<String, Object> payload = Map.of(
	        "model", "meta-llama/Llama-3.1-8B-Instruct:cerebras",
	        "messages", List.of(
	            Map.of("role", "system", "content", "You are a grammar correction assistant. Fix grammar, spelling, and punctuation in the given text. Return only the corrected text, no explanations."),
	            Map.of("role", "user", "content", text)
	        ),
	        "max_tokens", 150,
	        "stream", false
	    );

	    HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

	    try {
	        String response = restTemplate.postForObject(
	            "https://router.huggingface.co/v1/chat/completions",
	            request,
	            String.class
	        );

	        ObjectMapper mapper = new ObjectMapper();
	        JsonNode root = mapper.readTree(response);
	        String corrected = root.path("choices").get(0).path("message").path("content").asText();

	        return ResponseEntity.ok()
	            .contentType(MediaType.TEXT_PLAIN)
	            .body(corrected);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("Grammar fix failed: " + e.getMessage());
	    }
	}
}