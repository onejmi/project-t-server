import { ChatGPTAPIBrowser } from 'chatgpt';
import password from './password.js'

export class QGen {

    static instance: QGen;

    email: string | undefined
    password: string
    api: ChatGPTAPIBrowser | undefined

    constructor() {
        this.password = password; 
    }

    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new QGen();
        }
        return this.instance;
    }

    async start(email: string) {
        this.email = email;
        this.api = new ChatGPTAPIBrowser({
            email: this.email,
            password: this.password,
            isGoogleLogin: true,
            debug: false,
            minimize: true
          });
        await this.api.initSession();
    }

    async stop() {
        await this.api?.closeSession()
    }

    async generateQuestions(transcript: string) : Promise<string> {
    
      const prompt = `can you generate 4 multiple choice questions with answers based on this content in JSON array format: "${transcript}"`
    
      const res = await this.api?.sendMessage(prompt); 
      console.log(res?.response);
      const payload = res?.response.substring(res.response.indexOf('['), res.response.lastIndexOf(']\n') + 1);

      if (payload === undefined) {
        return '{}';
      }

      return payload;
    }

}