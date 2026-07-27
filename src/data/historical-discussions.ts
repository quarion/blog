export interface HistoricalComment {
  id: string;
  parentId?: string;
  author: string;
  username: string;
  createdAt: string;
  displayDate: string;
  edited?: boolean;
  message: readonly string[];
}

export interface HistoricalDiscussion {
  forum: string;
  threadId: string;
  identifier: string;
  retrievedAt: string;
  comments: readonly HistoricalComment[];
}

export const historicalDiscussions: Record<string, HistoricalDiscussion> = {
  "2016/05/09/commands-and-aspects": {
    forum: "quarion",
    threadId: "4815354693",
    identifier: "/2016/05/09/commands-and-aspects",
    retrievedAt: "2026-07-27",
    comments: [
      {
        id: "2673338980",
        author: "Tyler Ayers",
        username: "disqus_DnbHEKXYOy",
        createdAt: "2016-05-13T08:37:27",
        displayDate: "13 May 2016",
        message: [
          "Hi Filip, really enjoyed your post, good example of a command and aspect framework.",
        ],
      },
      {
        id: "2671736702",
        author: "Krzysiek",
        username: "krzysztof_siwek",
        createdAt: "2016-05-12T12:16:05",
        displayDate: "12 May 2016",
        message: [
          "Nice article (note ;-)) I would extend the error handling aspect to catch specific exceptions.",
        ],
      },
      {
        id: "2671991475",
        parentId: "2671736702",
        author: "fgibki",
        username: "fgibki",
        createdAt: "2016-05-12T15:02:17",
        displayDate: "12 May 2016",
        edited: true,
        message: [
          "Hi Krzysztof. Thanks for commenting. Yes, you are right. The error handling aspect should implement the full exception handling. So, in case of web services, it may create different response DTOs based on the different exception types, and log the exception stack trace for further audit.",
          "Maybe it will be a good idea to create another article that shows some standard implementations of the common aspects in more details.",
        ],
      },
    ],
  },
};
