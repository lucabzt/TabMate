class Tab {
    constructor(url, id, group = null, content_summary = null) {
      this.url = url
      this.id = id
      this.group = group
      this.content_summary = content_summary
    }

    updateGroup(group) {
      this.group = group
    }

    toString() {
      return "{URL: " + this.url + "\n GROUP: " + this.group + "\n CONTENT: " + this.content_summary + "}"
    }
}

export default Tab