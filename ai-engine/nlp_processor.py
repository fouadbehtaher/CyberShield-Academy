import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import Dict, List


class CybersecurityCoachAI:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
        self.model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
        self.cybersecurity_knowledge_base = self.load_knowledge_base()

    def load_knowledge_base(self) -> Dict:
        return {
            "phishing": {
                "indicators": ["urgent language", "suspicious links", "grammar mistakes"],
                "prevention": ["verify sender", "hover over links", "use 2FA"],
            },
            "malware": {
                "indicators": ["slow performance", "unusual popups", "changed settings"],
                "prevention": ["antivirus software", "regular updates", "avoid cracks"],
            },
        }

    def generate_response(self, user_input: str, user_context: Dict) -> str:
        intent = self.classify_intent(user_input)

        knowledge = self.retrieve_knowledge(intent, user_context)

        prompt = self.build_prompt(user_input, knowledge, user_context)
        response = self.generate_with_model(prompt)

        return self.post_process_response(response)

    def classify_intent(self, text: str) -> str:
        intents = {
            "phishing": ["تصيد", "phishing", "رسالة مشبوهة"],
            "malware": ["برمجية خبيثة", "فيروس", "malware"],
            "network": ["شبكة", "network", "واي فاي"],
            "general": ["مساعدة", "شرح", "كيف"],
        }

        for intent, keywords in intents.items():
            if any(keyword in text.lower() for keyword in keywords):
                return intent

        return "general"
