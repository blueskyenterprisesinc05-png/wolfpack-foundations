const fs = require('fs');
let content = fs.readFileSync('src/lib/profile.ts', 'utf8');
content = content.replace(/const uploadAvatarSchema[\s\S]*/, '');
content += `\nconst uploadAvatarSchema = z.object({
  base64: z.string().min(1),
  contentType: z.string().min(1),
  fileExt: z.string().min(1),
});

export const uploadAvatarFn = createServerFn({ method: 'POST' })
  .validator((data) => uploadAvatarSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const binaryString = atob(data.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const fileBuffer = bytes.buffer;
    const fileName = user.id + '-' + Date.now() + '.' + data.fileExt;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    return { success: true, publicUrl };
  });
`;
fs.writeFileSync('src/lib/profile.ts', content);
