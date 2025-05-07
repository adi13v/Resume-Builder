from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="cerebras",
    api_key="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",
)


def call_llm(prompt: str):
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct",
        messages=[
            {
                "role": "user",
                "content": f"""You are a resume parsing assistant. Based on the input text provided, convert the user's information into a strictly formatted JSON object matching the following structure:

             {
               "name": string,
               "email": string,
               "phoneNumber": string,
               "githubLink": string,
               "linkedInLink": string,
               "portfolioLink": string,
               "educationEntries": [
                 {
                   "instituteName": string,
                   "degree": string,
                   "location": string,
                   "startDate": string,
                   "endDate": string,
                   "gradeType": string,
                   "cgpa": string (optional),
                   "percentage": string (optional)
                 }
               ],
               "experienceEntries": [
                 {
                   "jobTitle": string,
                   "companyName": string,
                   "location": string,
                   "startDate": string,
                   "endDate": string,
                   "workList": [string]
                 }
               ],
               "projectEntries": [
                 {
                   "projectName": string,
                   "technologiesUsed": string,
                   "featureList": [string],
                   "startDate": string,
                   "endDate": string
                 }
               ],
               "skills": [
                 {
                   "key": string,
                   "value": string
                 }
               ]
             }
             
             Instructions:
             - Use placeholder values like "January 2023" or "Location Placeholder" if certain data is missing.
             - Ensure every required field is present in the JSON.
             - Only include valid JSON in your response, with no extra text or explanations.
             
             Now, convert the following user input into the above JSON format:
             
             {prompt}  
             """,
            }
        ],
        max_tokens=512,
    )

    print(completion.choices[0].message)
