import z from "zod";

export const accountSchema = z
  .object({
    did: z.string(),
    handle: z.string(),
    displayName: z.string().optional(),
    avatar: z.string().optional(),
    // associated: z.object({}),
    // labels: z.array(z.unknown()),
    createdAt: z.string().optional(),
    followersCount: z.number().optional(),
    followsCount: z.number().optional(),
    postsCount: z.number().optional(),
    description: z.string().optional(),
    viewer: z
      .object({
        following: z.string().optional(),
      })
      .optional(),
  })
  .strip();

export const externalEmbed = z.object({
  uri: z.string(),
  title: z.string(),
  description: z.string(),
  thumb: z.string(),
});

export const embedPostSchema = z.object({
  uri: z.string(),
  cid: z.string(),
  author: accountSchema,
  value: z
    .object({
      text: z.string(),
      createdAt: z.string(),
    })
    .strip(),
  likeCount: z.number().optional(),
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  quoteCount: z.number().optional(),
  indexedAt: z.string(),
  embeds: z
    .array(
      z.object({
        external: externalEmbed.optional().catch(() => undefined),
      }),
    )
    .optional(),
});

export const postSchema = z
  .object({
    uri: z.string(),
    cid: z.string(),
    author: accountSchema,
    record: z
      .object({
        text: z.string().optional(),
        createdAt: z.string().optional(),
        facets: z
          .array(
            z.object({
              features: z
                .array(
                  z.object({
                    uri: z.string().optional(),
                  }),
                )
                .optional(),
              index: z.object({
                byteEnd: z.number(),
                byteStart: z.number(),
              }),
            }),
          )
          .optional()
          .catch(() => undefined),
      })
      .strip(),
    embed: z
      .object({
        $type: z.string().optional(),
        images: z
          .array(
            z
              .object({
                thumb: z.string(),
                fullsize: z.string(),
                alt: z.string(),
                aspectRatio: z
                  .object({
                    height: z.number(),
                    width: z.number(),
                  })
                  .optional(),
              })
              .strip(),
          )
          .optional(),
        record: embedPostSchema.optional().catch(() => undefined),
        external: externalEmbed.optional().catch(() => undefined),
      })
      .strip()
      .optional(),
    replyCount: z.number().optional(),
    repostCount: z.number().optional(),
    likeCount: z.number().optional(),
    quoteCount: z.number().optional(),
    indexedAt: z.string(),
    viewer: z
      .object({
        threadMuted: z.boolean().optional(),
        like: z.string().optional(),
        embeddingDisabled: z.boolean().optional(),
      })
      .strip()
      .optional(),
    labels: z.array(
      z.object({
        src: z.string(),
        uri: z.string(),
        cid: z.string().optional(),
        val: z.string(),
        cts: z.string(),
        neg: z.boolean().optional(),
      }),
    ),
  })
  .strip();

export const repliesSchema = z.array(
  z
    .object({
      post: postSchema,
    })
    .strip(),
);

export const postsSchema = z.array(postSchema);

export const feedViewPostSchema = z
  .object({
    post: postSchema,
    reason: z
      .object({
        by: accountSchema,
      })
      .optional(),
  })
  .strip();

export const feedViewPostsSchema = z.array(feedViewPostSchema);

export const outputSchema = z.object({
  feed: feedViewPostsSchema,
  cursor: z.string().optional(),
});

export const feedGeneratorSchema = z.object({
  uri: z.string(),
  cid: z.string(),
  did: z.string(),
  creator: accountSchema,
  displayName: z.string(),
  description: z.string(),
  avatar: z.string().optional(),
  likeCount: z.number(),
  indexedAt: z.string(),
});

export const feedGeneratorsSchema = z.object({
  feeds: z.array(feedGeneratorSchema),
  cursor: z.string().optional(),
});

export const savedFeedsPrefSchema = z.object({
  $type: z.literal("app.bsky.actor.defs#savedFeedsPrefV2"),
  items: z.array(
    z
      .object({
        type: z.string(),
        value: z.string(),
        pinned: z.boolean(),
        id: z.string(),
      })
      .strip(),
  ),
});
