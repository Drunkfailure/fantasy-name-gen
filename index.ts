import { Plugin, Notice, Editor, requestUrl } from "obsidian";

const insertName = (editor: Editor, name: string) => {
  const cursor = editor.getCursor();
  editor.replaceRange(name, cursor);
  editor.setCursor(cursor.line, cursor.ch + name.length);
};

// Your Supabase Edge Function URL
// Format: https://<project-ref>.supabase.co/functions/v1/<function-name>
const SUPABASE_URL = "https://twtwwncgwqlvfxcxiokv.supabase.co/functions/v1/generate-fantasy-name";

// Your Supabase Anon Key (found in Project Settings > API)
// This is safe to use client-side - it respects Row Level Security policies
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHd3bmNnd3FsdmZ4Y3hpb2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjIyMTMsImV4cCI6MjA4MTczODIxM30.Zc30_A-HJ7_3HewvMj3mGEsW4vhQKOdTKcdFJOObEzc";

enum ANCESTRY {
  HUMAN = "h",
  DWARF = "d",
  ELF = "e",
  ORC = "o",
  TIEFLING = "t",
  GOBLIN = "g",
  DRAGONBORN = "b",
}

enum GENDER {
  MALE = "m",
  FEMALE = "f",
  ANY = "a",
}

type Event = {
  _time: string;
  path: string;
  headers: Record<string, string>;
  referrer: string;
  gender?: string;
  ancestry?: string;
  family?: boolean;
  name?: string;
};

type Family = boolean;

const editorCallback = async (editor: Editor, {gender, ancestry, family}: {gender?: GENDER, ancestry?: ANCESTRY, family?: Family}) => {
  let url = SUPABASE_URL;
  const params = [];

  // Default to family=true (last names included) if not specified
  const includeFamily = family !== undefined ? family : true;
  params.push(`family=${includeFamily ? 't' : 'f'}`);

  if (gender) {
    params.push(`gender=${gender}`);
  }

  if (ancestry) {
    params.push(`ancestry=${ancestry}`);
  }

  if (params.length) {
    url = `${url}?${params.join("&")}`;
  }

  try {
    // Edge Function is public (JWT verification disabled), no auth headers needed
    const resp = await requestUrl({
      url: url,
      method: 'GET',
    });
    const name = resp.text;
    new Notice(`Name: ${name}`);
    insertName(editor, name);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    new Notice(`Error generating name: ${errorMessage}`);
    console.error('Error generating fantasy name:', error);
  }
}

export default class FantasyNameGenerator extends Plugin {
  async onload() {
    console.log("loading fantasy-name plugin");

    const commands = [
      {
      id: "fantasy-name-insert-human",
      name: "Insert fantasy name: Human",
      editorCallback: (editor: Editor) => editorCallback(editor, {}),
      },
      {
        id: "fantasy-name-insert-human-female",
        name: "Insert fantasy name: Human - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-human-male",
        name: "Insert fantasy name: Human - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-elf",
        name: "Insert fantasy name: Elf",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ELF}),
      },
      {
        id: "fantasy-name-insert-elf-female",
        name: "Insert fantasy name: Elf - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ELF, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-elf-male",
        name: "Insert fantasy name: Elf - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ELF, gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-dwarf",
        name: "Insert fantasy name: Dwarf",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DWARF}),
      },
      {
        id: "fantasy-name-insert-dwarf-female",
        name: "Insert fantasy name: Dwarf - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DWARF, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-dwarf-male",
        name: "Insert fantasy name: Dwarf - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DWARF, gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-orc",
        name: "Insert fantasy name: Orc",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ORC}),
      },
      {
        id: "fantasy-name-insert-orc-female",
        name: "Insert fantasy name: Orc - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ORC, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-orc-male",
        name: "Insert fantasy name: Orc - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.ORC, gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-tiefling",
        name: "Insert fantasy name: Tiefling",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.TIEFLING}),
      },
      {
        id: "fantasy-name-insert-tiefling-female",
        name: "Insert fantasy name: Tiefling - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.TIEFLING, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-tiefling-male",
        name: "Insert fantasy name: Tiefling - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.TIEFLING, gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-goblin",
        name: "Insert fantasy name: Goblin",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.GOBLIN}),
      },
      {
        id: "fantasy-name-insert-goblin-female",
        name: "Insert fantasy name: Goblin - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.GOBLIN, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-goblin-male",
        name: "Insert fantasy name: Goblin - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.GOBLIN, gender: GENDER.MALE})
      },
      {
        id: "fantasy-name-insert-dragonborn",
        name: "Insert fantasy name: Dragonborn",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DRAGONBORN}),
      },
      {
        id: "fantasy-name-insert-dragonborn-female",
        name: "Insert fantasy name: Dragonborn - Female",
        editorCallback:  (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DRAGONBORN, gender: GENDER.FEMALE})
      },
      {
        id: "fantasy-name-insert-dragonborn-male",
        name: "Insert fantasy name: Dragonborn - Male",
        editorCallback: (editor: Editor) => editorCallback(editor, {ancestry: ANCESTRY.DRAGONBORN, gender: GENDER.MALE})
      }
    ];

    for (const command of commands) {
      this.addCommand(command);
    }
  }

  onunload() {
    console.log("unloading fantasy-name plugin");
  }
}
