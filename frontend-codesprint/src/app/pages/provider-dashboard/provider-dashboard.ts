import { Component } from '@angular/core';
import { LucideAngularModule,
  Clock,
  FileText,
  Inbox,
  DollarSign,
  ChartNoAxesColumnIncreasing,
  Calendar,
  User,
  MessageCircle,
  Plus,
  Check
} from "lucide-angular";
import {NavbarProvider} from '../../components/navbar-provider/navbar-provider';


@Component({
  selector: 'app-provider-dashboard',
  imports: [LucideAngularModule, NavbarProvider],
  templateUrl: './provider-dashboard.html',
  styleUrl: './provider-dashboard.css',
  standalone: true
})
export class ProviderDashboard {
  readonly FileText = FileText;
  readonly Inbox = Inbox;
  readonly DollarSign = DollarSign;
  readonly BarChart = ChartNoAxesColumnIncreasing;
  readonly Plus = Plus;
  readonly Calendar = Calendar;
  readonly User = User;
  readonly MessageCircle = MessageCircle;
  readonly Clock = Clock;
  readonly Check = Check;
}
