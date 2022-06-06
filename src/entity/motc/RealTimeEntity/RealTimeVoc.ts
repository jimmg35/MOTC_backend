import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'

@Entity('RealTime_VOC', { schema: 'public' })
export class RealTimeVoc {

  @Column("text", { primary: true, name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("text", { name: 'value', nullable: true })
  value: number | null

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null
}