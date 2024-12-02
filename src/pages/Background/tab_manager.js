/*
export interface chrome. tabs. Tab {
status?: string | undefined
index: number
openerTabId?: number | undefined
title?: string | undefined
url?: string | undefined
pendingUrl?: string | undefined
pinned: boolean
highlighted: boolean
windowId: number
active: boolean
favIconUrl?: string | undefined
id?: number | undefined
incognito: boolean
selected: boolean
audible?: boolean | undefined
discarded: boolean
autoDiscardable: boolean
mutedInfo?: MutedInfo | undefined
width?: number | undefined
height?: number | undefined
sessionId?: string | undefined
groupId: number }
 */
import Tab from './utils/tab.js'
import { getContent, isRestrictedUrl} from './utils/get_content';
import group_tabs from './group_tabs';

const DEFAULT_CONTENT = "No content summary available. Use url to guess content.";

class TabManager {
  constructor (model) {
    this.model = model
    this.active_tabs = null
  }

  async groupTabs () {
    await group_tabs(this.model, this.active_tabs)
  }

  async updateActiveTabs() {
    console.log("Updating active tabs...");
    this.active_tabs = []
    const all_tabs = await chrome.tabs.query({})

    //Loop through tabs and update them
    for (const tab of all_tabs) {
      const t = new Tab(tab.url, tab.id)

      if (isRestrictedUrl(t.url)) {
        t.content_summary = DEFAULT_CONTENT
        continue;
      }

      // Get content or null
      /*const content = await (async () => {
        try {
          return await getContent(tab.id);
        } catch {
          return null;
        }
      })();*/

      /*if (content) {
        //TODO add summarizer model
        t.content_summary = await this.model.prompt(
          "Please give me a short 2 Sentence summary of the following webpage. Limit yourself to 20 words. IMPORTANT: Your output needs to be in english" +
          content
        )
      } else {
        t.content_summary = DEFAULT_CONTENT;
      }*/
      t.content_summary = DEFAULT_CONTENT

      //Append to active tabs
      this.active_tabs.push(t)
    }
    console.log("Active tabs updated.");
  }
}

export default TabManager