CREATE TABLE `apiCredentials` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`platform` varchar(100) NOT NULL,
	`credentialKey` varchar(255) NOT NULL,
	`credentialSecret` text,
	`isActive` varchar(5) DEFAULT 'true',
	`lastValidated` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `apiCredentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`action` varchar(255) NOT NULL,
	`resource` varchar(255),
	`resourceId` varchar(255),
	`ipAddress` varchar(45),
	`userAgent` text,
	`status` varchar(50),
	`details` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaignMetrics` (
	`id` varchar(64) NOT NULL,
	`campaignId` varchar(64) NOT NULL,
	`date` timestamp DEFAULT (now()),
	`impressions` varchar(20) DEFAULT '0',
	`clicks` varchar(20) DEFAULT '0',
	`conversions` varchar(20) DEFAULT '0',
	`spend` varchar(20) DEFAULT '0',
	`revenue` varchar(20) DEFAULT '0',
	`ctr` varchar(20),
	`roas` varchar(20),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `campaignMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`platform` varchar(100) NOT NULL,
	`status` enum('draft','scheduled','active','paused','completed','failed') NOT NULL DEFAULT 'draft',
	`budget` varchar(20),
	`targetAudience` text,
	`keywords` text,
	`creativeAssets` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crmLeads` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`phone` varchar(20),
	`source` varchar(100),
	`status` varchar(50) DEFAULT 'new',
	`notes` text,
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `crmLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionPlans` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`monthlyPrice` varchar(20) NOT NULL,
	`features` text,
	`maxCampaigns` varchar(20),
	`maxUsers` varchar(20),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `subscriptionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSubscriptions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`planId` varchar(64) NOT NULL,
	`status` enum('active','inactive','cancelled','expired') NOT NULL DEFAULT 'active',
	`startDate` timestamp DEFAULT (now()),
	`endDate` timestamp,
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userSubscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsappInteractions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`leadId` varchar(64),
	`phoneNumber` varchar(20) NOT NULL,
	`messageType` varchar(50),
	`messageContent` text,
	`senderType` varchar(20),
	`status` varchar(50),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `whatsappInteractions_id` PRIMARY KEY(`id`)
);
