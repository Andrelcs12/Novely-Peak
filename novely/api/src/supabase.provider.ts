import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const supabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (configService: ConfigService) => {
    const url = configService.get<string>('SUPABASE_URL');
    const key = configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Supabase envs not found');
    }

    return createClient(url, key);
  },
  inject: [ConfigService],
};