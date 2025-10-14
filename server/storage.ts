import { 
  type User, type InsertUser, type BlogPost, type InsertBlogPost,
  type Poll, type InsertPoll, type VisitorStat, type InsertVisitorStat,
  type ToolUsage, type InsertToolUsage
} from "@shared/schema";
import { randomUUID } from "crypto";
import { comprehensiveBlogPosts } from "./blog-seed-data";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  incrementBlogViews(slug: string): Promise<void>;
  
  getActivePolls(): Promise<Poll[]>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  votePoll(id: string, optionIndex: number): Promise<Poll>;
  
  getTodayVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<void>;
  
  getToolUsage(toolName: string): Promise<ToolUsage | undefined>;
  incrementToolUsage(toolName: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private polls: Map<string, Poll>;
  private visitorStats: Map<string, VisitorStat>;
  private toolUsage: Map<string, ToolUsage>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.polls = new Map();
    this.visitorStats = new Map();
    this.toolUsage = new Map();
    
    this.seedData();
  }

  private seedData() {
    const blogPosts: InsertBlogPost[] = comprehensiveBlogPosts;

    const samplePolls: InsertPoll[] = [
      {
        question: "What's your favorite Free Fire game mode?",
        options: ["Battle Royale", "Clash Squad", "Lone Wolf", "Craftland"],
        votes: ["45", "32", "18", "23"],
        active: true,
      },
      {
        question: "Which web framework should I learn next?",
        options: ["React", "Vue.js", "Angular", "Svelte"],
        votes: ["78", "34", "12", "25"],
        active: true,
      },
      {
        question: "What content do you want to see more of?",
        options: ["Free Fire Tips", "Coding Tutorials", "YouTube Guides", "Gaming News"],
        votes: ["0", "0", "0", "0"],
        active: true,
      }
    ];

    for (const post of blogPosts) {
      const id = randomUUID();
      const blogPost: BlogPost = {
        id,
        ...post,
        imageUrl: post.imageUrl || null,
        published: post.published ?? true,
        views: 0,
        createdAt: new Date(),
      };
      this.blogPosts.set(blogPost.slug, blogPost);
    }

    for (const poll of samplePolls) {
      const id = randomUUID();
      const pollData: Poll = {
        id,
        ...poll,
        active: poll.active ?? true,
        createdAt: new Date(),
      };
      this.polls.set(id, pollData);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const blogPost: BlogPost = {
      id,
      ...post,
      imageUrl: post.imageUrl || null,
      published: post.published ?? true,
      views: 0,
      createdAt: new Date(),
    };
    this.blogPosts.set(blogPost.slug, blogPost);
    return blogPost;
  }

  async incrementBlogViews(slug: string): Promise<void> {
    const post = this.blogPosts.get(slug);
    if (post) {
      post.views += 1;
      this.blogPosts.set(slug, post);
    }
  }

  async getActivePolls(): Promise<Poll[]> {
    return Array.from(this.polls.values())
      .filter(poll => poll.active)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const id = randomUUID();
    const pollData: Poll = {
      id,
      ...poll,
      active: poll.active ?? true,
      createdAt: new Date(),
    };
    this.polls.set(id, pollData);
    return pollData;
  }

  async votePoll(id: string, optionIndex: number): Promise<Poll> {
    const poll = this.polls.get(id);
    if (!poll) throw new Error("Poll not found");
    
    const currentVotes = poll.votes.map(v => parseInt(v));
    currentVotes[optionIndex] = (currentVotes[optionIndex] || 0) + 1;
    poll.votes = currentVotes.map(v => v.toString());
    
    this.polls.set(id, poll);
    return poll;
  }

  async getTodayVisitorCount(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const stat = this.visitorStats.get(today);
    return stat?.count || 0;
  }

  async incrementVisitorCount(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.visitorStats.get(today);
    
    if (existing) {
      existing.count += 1;
      this.visitorStats.set(today, existing);
    } else {
      const id = randomUUID();
      this.visitorStats.set(today, { id, date: today, count: 1 });
    }
  }

  async getToolUsage(toolName: string): Promise<ToolUsage | undefined> {
    return Array.from(this.toolUsage.values()).find(
      (usage) => usage.toolName === toolName
    );
  }

  async incrementToolUsage(toolName: string): Promise<void> {
    const existing = await this.getToolUsage(toolName);
    
    if (existing) {
      existing.usageCount += 1;
      existing.lastUsed = new Date();
      this.toolUsage.set(existing.id, existing);
    } else {
      const id = randomUUID();
      this.toolUsage.set(id, {
        id,
        toolName,
        usageCount: 1,
        lastUsed: new Date(),
      });
    }
  }
}

export const storage = new MemStorage();
